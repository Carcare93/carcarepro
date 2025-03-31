
import { CarService } from './car-service';
import { ApiService } from './api';

// Create a mock for the ApiService
jest.mock('./api', () => {
  return {
    ApiService: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    })),
    apiService: {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    },
  };
});

describe('CarService', () => {
  let mockApi: jest.Mocked<ApiService>;
  let carService: CarService;
  
  beforeEach(() => {
    // Create a fresh mock for each test
    mockApi = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ApiService>;
    
    carService = new CarService(mockApi);
  });
  
  describe('getUserVehicles', () => {
    it('should call api.get with the correct endpoint', async () => {
      const mockVehicles = [{ id: '1', make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC123' }];
      mockApi.get.mockResolvedValue(mockVehicles);
      
      const result = await carService.getUserVehicles();
      
      expect(mockApi.get).toHaveBeenCalledWith('/vehicles');
      expect(result).toEqual(mockVehicles);
    });
  });
  
  describe('getServiceProviders', () => {
    it('should call api.get with the correct endpoint and query parameters', async () => {
      const mockProviders = [{ 
        id: '1', 
        name: 'Auto Shop', 
        location: {
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        services: ['oil change', 'brake repair'],
        rating: 4.5,
        reviewCount: 100
      }];
      
      mockApi.get.mockResolvedValue(mockProviders);
      
      const result = await carService.getServiceProviders('Los Angeles');
      
      expect(mockApi.get).toHaveBeenCalledWith('/service-providers?location=Los%20Angeles');
      expect(result).toEqual(mockProviders);
    });
  });
  
  describe('addVehicle', () => {
    it('should call api.post with the correct endpoint and data', async () => {
      const newVehicle = { make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'XYZ789' };
      const mockResponse = { id: '2', ...newVehicle };
      
      mockApi.post.mockResolvedValue(mockResponse);
      
      const result = await carService.addVehicle(newVehicle);
      
      expect(mockApi.post).toHaveBeenCalledWith('/vehicles', newVehicle);
      expect(result).toEqual(mockResponse);
    });
  });
});
