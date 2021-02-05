export class IStdPayment {
	constructor() {}
	
	id= 0;

	refNum: string;

	bank: string;

	hesab: string;

	shobe: string;

	price: number;

	

	paymentTypeId: number;

    studentId: number;
    
	stdClassMngId: number;

	contractId: number;


	studentFullName = "";
	paymentTypeTitle = "";
	contractTitle = "";
	priceString = "";
	

}
