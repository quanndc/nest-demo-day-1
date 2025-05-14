import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
    constructor(private readonly elastisSearchService: ElasticsearchService) {
        console.log(this.elastisSearchService.name);
    }


    async indexDocument<T>(index: string, document: any){
        const response = await this.elastisSearchService.index<T>({
            index: index,
            body: document
        })
        return response;
        //indice -> thu vien
        // index -> tu sach khoa hoc
        // shard -> sinh hoc, vat ly, ...
        // replica -> 
    }

    async searchDocumentSingleField<T>(index: string, query: string){
        const response = await this.elastisSearchService.search<T>({
            index: index,
            query: {
                match: {
                    name: query,
                }
            }
        })
        return response;
    }

    async searchDocumentMultiField<T>(index: string, querySearch: string, fields: string[]){
        const response = await this.elastisSearchService.search<T>({
            index: index,
            query: {
                multi_match: {
                    query: querySearch,
                    fields: fields,
                    fuzziness: 'AUTO',
                    type: 'best_fields',
                }
            }
        })
        return response;
    }
}
