///<reference path="../Http/RequestOptions.ts"/>
///<reference path="../Data/Query/Query.ts"/>
///<reference path="../Data/Query/IQueryExecutor.ts"/>
///<reference path="Service.ts"/>

module TSCore.App.Api {

    import Query = TSCore.App.Data.Query.Query;
    import IQueryExecutor = TSCore.App.Data.Query.IQueryExecutor;
    import RequestOptions = TSCore.App.Http.RequestOptions;
    import List = TSCore.Data.List;
    import Model = TSCore.Data.Model;

    export enum RequestHandlerFeatures {
        OFFSET,
        LIMIT,
        FIELDS,
        CONDITIONS,
        SORTERS,
        INCLUDES
    }

    export interface IRequestHandlerPlugin {
        execute(requestOptions: RequestOptions, query: Query<any>): RequestHandlerFeatures|RequestHandlerFeatures[]
    }

    export class RequestHandler implements IQueryExecutor {

        public _apiService: Service;
        public _resourceName: string;
        public _resource: IResource;
        public _plugins: List<IRequestHandlerPlugin> = new List<IRequestHandlerPlugin>();

        public constructor(
            protected $q: ng.IQService,
            protected httpService: TSCore.App.Http.Service
        ) {
        }

        public setApiService(apiService: Service) {
            this._apiService = apiService;
        }

        public getApiService(): Service {
            return this._apiService;
        }

        public setResourceName(name: string) {
            this._resourceName = name;
        }

        public getResourceName(): string {
            return this._resourceName;
        }

        public setResource(resource: IResource) {
            this._resource = resource;
        }

        public getResource(): IResource {
            return this._resource;
        }

        public plugin(plugin: IRequestHandlerPlugin): RequestHandler {
            this._plugins.add(plugin);
            return this;
        }

        public request(requestOptions: RequestOptions): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            var prefix = this.getResource().getPrefix();
            var relativeUrl = requestOptions.getUrl();

            requestOptions.url(prefix + relativeUrl);

            return this.httpService.request(requestOptions);
        }

        public execute(query: Query<any>):  ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            var requestOptions = RequestOptions.get('/');

            if (query.hasFind()) {

                var id = query.getFind();

                requestOptions = RequestOptions.get('/:id', { id: id });
            }

            var allowedFeatures = [];

            this._plugins.each(plugin => {

                allowedFeatures.push(
                    plugin.execute(requestOptions, query)
                );
            });

            allowedFeatures = _.flatten(allowedFeatures);

            var usedFeatures = this._getUsedFeatures(query);

            var forbiddenFeatures = _.difference(usedFeatures, allowedFeatures);

            if (forbiddenFeatures.length > 0) {
                return this.$q.reject();
            }

            return this.request(requestOptions);
        }

        protected _getUsedFeatures(query: Query<any>): RequestHandlerFeatures[] {

            var features = [];

            if (query.hasOffset()) {
                features.push(RequestHandlerFeatures.OFFSET);
            }

            if (query.hasLimit()) {
                features.push(RequestHandlerFeatures.LIMIT);
            }

            if (query.hasFields()) {
                features.push(RequestHandlerFeatures.FIELDS);
            }

            if (query.hasConditions()) {
                features.push(RequestHandlerFeatures.CONDITIONS);
            }

            if (query.hasSorters()) {
                features.push(RequestHandlerFeatures.SORTERS);
            }

            if (query.hasIncludes()) {
                features.push(RequestHandlerFeatures.INCLUDES);
            }

            return features;
        }

        public all():  ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(

                RequestOptions
                    .get('/')

            );
        }

        public find(id: number):  ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(

                RequestOptions
                    .get('/:id', { id: id })

            );
        }

        public create(data: {}):  ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(

                RequestOptions
                    .post('/')
                    .data(data)

            );
        }

        public update(id: number, data: {}):  ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(

                RequestOptions
                    .put('/:id', { id: id })
                    .data(data)

            );
        }

        public remove(id: number):  ng.IPromise<ng.IHttpPromiseCallbackArg<{}>> {

            return this.request(

                RequestOptions
                    .delete('/:id', { id: id })

            );
        }
    }
}