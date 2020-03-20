export class IConstractType {
    constructor() {}

    id = 0;

    title: string;

	table: ContractTypeTable;
	
	content: string = "";

	

	haveContracts = false;
}

export enum ContractTypeTable {
    Student = 0,
    Person = 1,
    Other = 2
}
