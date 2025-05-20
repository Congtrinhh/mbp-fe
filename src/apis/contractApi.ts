import type { Contract } from "@/entities/contract";
import BaseApi from "./baseApi";

class ContractApi extends BaseApi<Contract> {
	private static instance: ContractApi;

	constructor() {
		super("contracts");
	}

	public static getInstance(): ContractApi {
		if (ContractApi.instance == null) {
			ContractApi.instance = new ContractApi();
		}
		return ContractApi.instance;
	}
}

export const contractApi = ContractApi.getInstance();
