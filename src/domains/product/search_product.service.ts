import { Injectable, OnModuleInit } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Product } from "./entities/product.entity";

@Injectable()
export class SearchProductService implements OnModuleInit {
    constructor(private readonly elastisSearchService: ElasticsearchService) {
        console.log(this.elastisSearchService.name);
    }

    async onModuleInit() {
        const res = await this.elastisSearchService.ping()
        console.log('Elasticsearch is running');
        console.log(res);
    }

    async indexDocument(index: string, document: any) {
        const response = await this.elastisSearchService.index({
            index: index,
            document: document
        })
        return response;
    }

    async searchDocument(index: string, query: string) {
        const response =  await this.elastisSearchService.search({
            index: index,
            query: {
                multi_match: {
                    query: query,
                    fields: ['name', 'description'],
                    fuzziness: 'AUTO',
                }
            }
        })
        return response;
    }
}