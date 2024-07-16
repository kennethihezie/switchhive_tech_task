import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../model/dto/create-product.dto';
import { UpdateProductDto } from '../model/dto/update-product.dto';
import { Product } from '../model/entity/product.entity';
import { ProductsService } from '../products.service';

const mockProductRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  findBy: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useFactory: mockProductRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<MockRepository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and save a new product', async () => {
      const dto: CreateProductDto = { name: 'Product1', price: 100, description: 'a product', imageUrl: 'image.com', userId: '1' };
      const product = { id: '1', ...dto };

      repository.create.mockReturnValue(product);
      repository.save.mockResolvedValue(product);

      expect(await service.createProduct(dto)).toEqual(product);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('updateProduct', () => {
    it('should update and save an existing product', async () => {
      const id = '1';
      const dto: UpdateProductDto = { name: 'UpdatedProduct', price: 150 };
      const product = { id, name: 'Product1', price: 100 };
      const updatedProduct = { ...product, ...dto };

      repository.findOneBy.mockResolvedValue(product);
      repository.save.mockResolvedValue(updatedProduct);

      expect(await service.updateProduct(id, dto)).toEqual(updatedProduct);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.save).toHaveBeenCalledWith(updatedProduct);
    });

    it('should throw a NotFoundException if product does not exist', async () => {
      const id = '1';
      const dto: UpdateProductDto = { name: 'UpdatedProduct', price: 150 };

      repository.findOneBy.mockResolvedValue(null);

      await expect(service.updateProduct(id, dto)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const id = '1';
      const product = { id, name: 'Product1', price: 100 };

      repository.findOneBy.mockResolvedValue(product);

      expect(await service.getProduct(id)).toEqual(product);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('getUserProducts', () => {
    it('should return products by userId', async () => {
      const userId = '1';
      const products = [
        { id: '1', name: 'Product1', price: 100 },
        { id: '2', name: 'Product2', price: 200 },
      ];

      repository.findBy.mockResolvedValue(products);

      expect(await service.getUserProducts(userId)).toEqual(products);
      expect(repository.findBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const products = [
        { id: '1', name: 'Product1', price: 100 },
        { id: '2', name: 'Product2', price: 200 },
      ];

      repository.find.mockResolvedValue(products);

      expect(await service.getProducts()).toEqual(products);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return it', async () => {
      const id = '1';
      const product = { id, name: 'Product1', price: 100 };

      repository.findOneBy.mockResolvedValue(product);
      repository.remove.mockResolvedValue(product);

      expect(await service.deleteProduct(id)).toEqual(product);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.remove).toHaveBeenCalledWith(product);
    });

    it('should throw a NotFoundException if product does not exist', async () => {
      const id = '1';

      repository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteProduct(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });
});