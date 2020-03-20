export class IContract {
    constructor() {}

    id = 0;

    code: number;

    date: string;

    title: string;

	partyContractId: number;

	partyContractName: string = "";
	
    price: string;

    fileUrl: string;

	contractTypeId: number;
	

	fileData: string = "";

	fileName: string = "";



	datePersian = "";

	
    haveStdPayments = false;
}
