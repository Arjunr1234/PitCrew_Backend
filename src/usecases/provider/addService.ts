import { log } from "console";
import { IProviderAddServiceInteractor } from "../../entities/iInteractor/provider/addService";
import IproviderRepository, { IBrandData } from "../../entities/irepository/iproviderRepo";
import { ServiceType } from "../../entities/rules/admin";
import { IAddBrandData, IAddingData, IAdminBrand, IBrand, IEditSubType, IProviderBrand, IProviderGeneralServiceData, IProviderRoadServiceData, IRemoveBrandData, IRemoveService, IRemoveSubTypeData, ISubTypeData, Services } from "../../entities/rules/provider";

class ProviderAddServiceInteractor implements IProviderAddServiceInteractor {
    constructor(
        private readonly AddServiceRepository: IproviderRepository
    ) {}

  
   
  async getAllProviderService(
    id: string, 
    vehicleType: number
  ): Promise<{ 
    success: boolean; 
    message?: string; 
    providerGeneralServiceData?: IProviderGeneralServiceData[]; 
    providerRoadServiceData?: IProviderRoadServiceData[]; 
  }> {
    try {
      const getProviders = await this.AddServiceRepository.getAllProviderService(id, vehicleType);

      if (!getProviders.allServices) {
        return { 
          success: false, 
          message: "No services found for the provider" 
        };
      }
  
      const providerServices:Services[] = 
        vehicleType === 2 
          ? getProviders.providerService?.twoWheeler || [] 
          : getProviders.providerService?.fourWheeler || []; 
  
        if(providerServices.length === 0){
           return await this.organizeProviderServices(getProviders.allServices)
        }else{
          return await this.organizeProviderServicesALL(
            getProviders.allServices,
            providerServices
          )
        }
  
    } catch (error) {
      console.error("Error in getAllProviderService: ", error);
      return { 
        success: false, 
        message: "An error occurred while fetching provider services" 
      };
    }
  }

 

  private async organizeProviderServices(allServices: ServiceType[]):
    Promise<{ success: boolean, message?: string, providerGeneralServiceData?: IProviderGeneralServiceData[], providerRoadServiceData?: IProviderRoadServiceData[] }> {


    const providerGeneralService: IProviderGeneralServiceData[] = [];
    const providerRoadService: IProviderRoadServiceData[] = [];

    if (allServices) {
      for (const service of allServices) {
        if (service.category === 'general') {
          const generalService: IProviderGeneralServiceData = {
            typeid: service._id,
            typename: service.serviceType,
            category: service.category,
            image: service.imageUrl,
            isAdded: false,
            subType:
              service.subTypes?.map((item) => ({
                isAdded: false,
                type: item.type,
                _id:item._id
              })) || []
          }
          providerGeneralService.push(generalService)
        } else if (service.category === 'road') {
          const roadService: IProviderRoadServiceData = {
            typeid: service._id,
            typename: service.serviceType,
            category: service.category,
            image: service.imageUrl,
            isAdded: false,
          }

          providerRoadService.push(roadService)
        }
      }
    }

    return {
      success: true,
      message: "200",
      providerGeneralServiceData: providerGeneralService,
      providerRoadServiceData: providerRoadService
    }

  }

  private async organizeProviderServicesALL(
    allServices: ServiceType[] | undefined,
    providerServices: Services[]
  ): Promise<{ 
    success: boolean, 
    message?: string, 
    providerGeneralServiceData?: IProviderGeneralServiceData[], 
    providerRoadServiceData?: IProviderRoadServiceData[] 
  }> {
  console.log("this si the adminService://////////////////////////////////////////////////",allServices)
  const result = providerServices.find((service) => service.typeId+"" === "671a48d7b99677956e7caee4")
  console.log("////////////////////////////////////////////: ",result)
  console.log("This is the providerServices:  /////////////////////////////////////////////////////////////",providerServices)
  

  
    const providerGeneralService: IProviderGeneralServiceData[] = [];
    const providerRoadService: IProviderRoadServiceData[] = [];
  
    if (allServices && providerServices) {
      for (let service of allServices) {
        if (service.category === "general") {
          const checker = providerServices.find((item) => item.typeId + "" === service._id+"");
         
         
          if (checker) {
            const generalService: IProviderGeneralServiceData = {
              typeid: service._id,
              typename: service.serviceType,
              category: service.category,
              image: service.imageUrl,
              isAdded: true,
              subType: service.subTypes?.map((item) => ({        
                isAdded: checker.subType?.some((sub) => sub.type+"" === item._id+""),
                priceRange: checker.subType?.find((sub) => sub.type+"" === item._id+"")?.startingPrice ?? undefined,
                type: item.type,
                _id:item._id
              })) || []
              
              
             
            };
           
            
            providerGeneralService.push(generalService);
          } else {
            const generalService: IProviderGeneralServiceData = {
              typeid: service._id,
              typename: service.serviceType,
              category: service.category,
              image: service.imageUrl,
              isAdded: false,
              subType: service.subTypes?.map((item) => ({
                isAdded: false,
                type: item.type,
                _id:item._id,
                priceRange:undefined
                
              })) || []
            };
            
            providerGeneralService.push(generalService);
          }
        } else if (service.category === "road") {
          const checker = providerServices.find((item) => item.typeId + "" === service._id);
          
          if (checker) {
            const roadService: IProviderRoadServiceData = {
              typeid: service._id,
              image: service.imageUrl,
              typename: service.serviceType,
              category: service.category,
              isAdded: true
            };
            providerRoadService.push(roadService);
          } else {
            const roadService: IProviderRoadServiceData = {
              typeid: service._id,
              image: service.imageUrl,
              typename: service.serviceType,
              category: service.category,
              isAdded: false
            };
            providerRoadService.push(roadService);
          }
        }
      }
    }
  
    return {
      success: true,
      message: "successfull",
      providerGeneralServiceData: providerGeneralService,
      providerRoadServiceData: providerRoadService
    };
  }
  

  async addGeneralOrRoadServiceUseCase(data: IAddingData): Promise<{ success: boolean; message?: string; }> {
       
               try {
                  const response = await this.AddServiceRepository.addGeneralOrRoadService(data)

                  if(!response.success){
                    return {  success:response.success, message:response.message }
                  }

                  return {success:response.success, message:response.message}
                
               } catch (error) {
                   console.log("Error in addGeneralOr")
                   return {success:false, message:"something went wrong in addGeneralOrRoadService"}
                
               }
  }

  async getAllBrandsUseCase(providerId: string): Promise<{ success: boolean; message?: string; brandData?: IBrand[] | []; }> {
    try {
      const response = await this.AddServiceRepository.getAllBrandsRepo(providerId);
  
      if (!response.success) {
        return { success: false, message: response.message };
      }
  
      if (!response.adminBrand) {
        return { success: false, message: "Admin brands not found" };
      }
  
      // Organize the admin and provider brands
      const adminBrandWithStatus = await this.organizeBrand(response.adminBrand, response.providerBrand || []);
  
      // Map to IBrand[] and return
      const brandData: IBrand[] = adminBrandWithStatus.map((brand) => ({
        brandId: brand.id,           // Mapping `id` as `brandId`
        brandName: brand.brand,      // Mapping `brand` as `brandName`
        isAdded: brand.isAdded       // Retaining the `isAdded` status
      }));
  
      return { success: true, brandData };
  
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred", brandData: [] };
    }
  }

  private async organizeBrand(adminBrand: IAdminBrand[], providerBrand: IProviderBrand[]): Promise<(IAdminBrand & { isAdded: boolean })[]> {
    return adminBrand.map((admin) => {
      
      const isAdded = providerBrand.some((provider) => provider.brandId === admin.id);
      
      
      return {
        ...admin,
        isAdded 
      };
    });
  }

  async addBrandUseCase(brandData: IAddBrandData): Promise<{ success: boolean; message?: string; }> {
          try {
              const response = await this.AddServiceRepository.addBrandRepo(brandData)
              return {success:response.success, message:response.message}
          } catch (error) {
               console.log("Error in addBrandUseCase: ",error);
               return{success:false, message:"Something went wrong in addBrandUseCase"}
            
          }
  }

  async removeBrandUseCase(brandData: IRemoveBrandData): Promise<{ success: boolean; message?: string; }> {
       try {
           const response = await this.AddServiceRepository.removeBrandRepo(brandData);
           return {success:response.success, message:response.message}
        
       } catch (error) {
          console.log("Error in removeBrandUseCase: ",error);
          return {success:false, message:"Somethng went wrong in removeBrandusecase"}
        
       }
  }

  
  async addSubTypeUseCase(data: ISubTypeData): Promise<{ success: boolean; message?: string; }> {
         
          try {
              const response = this.AddServiceRepository.addSubTypeRepo(data);
              return response
            
          } catch (error) {
              console.log("Error in addSubTypeUseCase: ",error);
              return {success:false, message:"Something went wrong in addSubTypeUseCase"}
            
          }
  }
    
  async removeSubTypeUseCase(data: IRemoveSubTypeData): Promise<{ success: boolean; message?: string; }> {
        try {
             const response = await this.AddServiceRepository.removeSubTypeRepo(data);
             return {success:response.success, message:response.message}
        } catch (error) {
            console.log("Error in removeSubTypeUseCase: ",error)
            return {success:false, message:"something went wrong in removeSubTypeUseCase"}
        }
  }  

  async editSubTypeUseCase(data: IEditSubType): Promise<{ success: boolean; message?: string; }> {
      try {
          const response = await this.AddServiceRepository.editSubTypeRepo(data);
          return response
        
      } catch (error) {
           console.log("Error in editSubTypeUseCase: ",error)
           return {success:false, message:"Something went wrong in EditSubTypeRepo"}
      }
  }

  async removeServiceUseCase(data: IRemoveService): Promise<{ success: boolean; message?: string; }> {
       try {
            const response = await this.AddServiceRepository.removeServiceRepo(data);
            return response
        
       } catch (error) {
          console.log("Error in removeServiceUseCase: ",error);
          return {success:false, message:"Something went wrong in removeServiceUseCase"}
        
       }
  }

  
    
}

export default ProviderAddServiceInteractor;
