import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenGuard } from '../../auth/guard/access_token.guard';
import { User } from '../../users/model/entity/user.entity';
import { CreateProductDto } from '../model/dto/create-product.dto';
import { UpdateProductDto } from '../model/dto/update-product.dto';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';


const mockProductsService = () => ({
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  getProducts: jest.fn(),
  getUserProducts: jest.fn(),
  getProduct: jest.fn(),
  deleteProduct: jest.fn(),
});

type MockProductsService = ReturnType<typeof mockProductsService>;

const mockAccessTokenGuard = jest.fn().mockImplementation(() => true);
const mockCurrentUser = jest.fn().mockImplementation(() => ({ id: '1', email: 'test@example.com' }));

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: MockProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useFactory: mockProductsService },
      ],
    })
    .overrideGuard(AccessTokenGuard)
    .useValue(mockAccessTokenGuard)
    .overrideProvider(User)
    .useValue(mockCurrentUser)
    .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<MockProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const dto: CreateProductDto = { name: 'Product1', price: 100, userId: '1', description: 'a product', imageUrl: 'image.com' };
      const user: User = { id: '1', email: 'test@example.com', password: 'password' } as User;
      const result = { id: '1', ...dto };

      service.createProduct.mockResolvedValue(result);

      expect(await controller.createProduct(dto, user)).toEqual(result);
      expect(service.createProduct).toHaveBeenCalledWith({ ...dto, userId: user.id });
    });
  });

  describe('updateProduct', () => {
    it('should update and return the updated product', async () => {
      const id = '1';
      const dto: UpdateProductDto = { name: 'UpdatedProduct', price: 150, userId: '1', description: 'a product', imageUrl: 'image.com' };
      const result = { id, ...dto };

      service.updateProduct.mockResolvedValue(result);

      expect(await controller.updateProduct(dto, id)).toEqual(result);
      expect(service.updateProduct).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const result = [
        { id: '1', name: 'Product1', price: 100 },
        { id: '2', name: 'Product2', price: 200 },
      ];

      service.getProducts.mockResolvedValue(result);

      expect(await controller.getProducts()).toEqual(result);
      expect(service.getProducts).toHaveBeenCalled();
    });
  });

  describe('getUserProducts', () => {
    it('should return products of the user', async () => {
      const user: User = { id: '1', email: 'test@example.com', password: 'password' } as User;
      const result = [
        { id: '1', name: 'Product1', price: 100 },
        { id: '2', name: 'Product2', price: 200 },
      ];

      service.getUserProducts.mockResolvedValue(result);

      expect(await controller.getUserProducts(user)).toEqual(result);
      expect(service.getUserProducts).toHaveBeenCalledWith(user.id);
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const id = '1';
      const result = { id, name: 'Product1', price: 100 };

      service.getProduct.mockResolvedValue(result);

      expect(await controller.getProduct(id)).toEqual(result);
      expect(service.getProduct).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteProduct', () => {
    it('should delete and return the product', async () => {
      const user: User = { id: '1', email: 'test@example.com', password: 'password' } as User;
      const result = { id: '1', name: 'Product1', price: 100 };

      service.deleteProduct.mockResolvedValue(result);

      expect(await controller.deleteProduct(user)).toEqual(result);
      expect(service.deleteProduct).toHaveBeenCalledWith(user.id);
    });
  });
});