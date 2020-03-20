import { MatPaginatorIntl } from "@angular/material";
import { Injectable } from "@angular/core";

@Injectable()
export class MatPaginatorIntlCro extends MatPaginatorIntl {
    firstPageLabel = "صفحه اول";
    itemsPerPageLabel = "نمایش محتویات";
    lastPageLabel = "صفحه آخر";
    nextPageLabel = "صفحه بعد";
    previousPageLabel = "صفحه قبل";

    getRangeLabel = function (page, pageSize, length) {
        if (length == 0 || pageSize == 0) { return `0 از ${length}`; }

        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;

        
        // ${startIndex + 1} - ${endIndex} از ${length} - 
        

        return `صفحه ${page + 1}  --  ${startIndex + 1} تا ${endIndex} از ${length}`;
    };

}
