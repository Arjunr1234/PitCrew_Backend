import { IProviderDashboardInteractor } from "../../entities/iInteractor/provider/dashboard";
import IproviderRepository from "../../entities/irepository/iproviderRepo";




class ProviderDashboardInteractor implements IProviderDashboardInteractor{
    constructor(private readonly providerDashboardRepo:IproviderRepository){}
    
}

export default ProviderDashboardInteractor