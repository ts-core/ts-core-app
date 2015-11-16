/// <reference path="../typings/ts-core.d.ts" />
declare module TSCore.App {
}
declare module TSCore.App.Auth {
    interface AccountType {
        login(data: any): ng.IPromise<Session>;
        authenticate(identity: any): ng.IPromise<void>;
        logout(session: any): ng.IPromise<void>;
    }
}
declare module TSCore.App.Auth {
    module ManagerEvents {
        const LOGIN_ATTEMPT_FAIL: string;
        const LOGIN_ATTEMPT_SUCCESS: string;
        const LOGIN: string;
        const LOGOUT: string;
        const SESSION_SET: string;
        const SESSION_CLEARED: string;
    }
    class Manager {
        protected $q: ng.IQService;
        events: TSCore.Events.EventEmitter;
        protected _accountTypes: TSCore.Data.Dictionary<any, AccountType>;
        protected _session: Session;
        static $inject: string[];
        constructor($q: ng.IQService);
        registerAccountType(name: any, account: AccountType): Manager;
        getAccountTypes(): TSCore.Data.Dictionary<any, AccountType>;
        getSession(): Session;
        setSession(session: Session): void;
        clearSession(): Manager;
        loggedIn(): boolean;
        getAccountType(name: any): AccountType;
        login(accountTypeName: any, credentials: {}): ng.IPromise<Session>;
        logout(accountTypeName: any): ng.IPromise<void>;
    }
}
declare module TSCore.App.Auth {
    class Session {
        protected _accountTypeName: string;
        protected _identity: number;
        protected _startTime: number;
        protected _expirationTime: number;
        protected _token: string;
        constructor(_accountTypeName: string, _identity: number, _startTime: number, _expirationTime: number, _token: string);
        setIdentity(identity: any): void;
        getIdentity(): number;
        setToken(token: any): void;
        getToken(): string;
        setExpirationTime(time: any): void;
        getExpirationTime(): number;
        setStartTime(time: any): void;
        getStartTime(): number;
        setAccountTypeName(accountTypeName: any): void;
        getAccountTypeName(): string;
        toJson(): {
            accountTypeName: string;
            identity: number;
            startTime: number;
            expirationTime: number;
            token: string;
        };
        static fromJson(obj: any): Session;
    }
}
declare module TSCore.App.Data {
    interface IModelInterface extends TSCore.Data.IModelInterface {
    }
    class Model extends TSCore.Data.Model {
        protected _relationKeys: TSCore.Data.Dictionary<string, TSCore.Data.Collection<any>>;
        constructor(data?: {});
        static relations(): any;
        getRelation(type: string): ng.IPromise<any>;
        getRelationStored(type: string): any[];
        addRelationKey(type: string, key: any): void;
        addManyRelationKeys(type: string, keys: any[]): void;
        removeRelationKey(type: string, key: any): void;
        getRelationKeys(type: string): any[];
    }
}
declare module TSCore.App.Data {
    class RemoteModelStore<T extends Model> {
        protected $q: ng.IQService;
        protected $injector: any;
        endpoint: TSCore.App.Http.ApiEndpoint;
        modelClass: TSCore.App.Data.IModelInterface;
        static $inject: string[];
        store: TSCore.Data.ModelDictionary<any, T>;
        protected _storeComplete: boolean;
        private _processListResponseCallback;
        private _processGetResponseCallback;
        constructor($q: ng.IQService, $injector: any, endpoint: TSCore.App.Http.ApiEndpoint, modelClass: TSCore.App.Data.IModelInterface);
        list(userOptions?: any, requestOptions?: TSCore.App.Http.IApiRequest, fresh?: boolean): ng.IPromise<T[]>;
        get(id: any, userOptions?: any, requestOptions?: {}, fresh?: boolean): ng.IPromise<T>;
        getMany(ids: any[], userOptions?: any, requestOptions?: {}, fresh?: boolean): ng.IPromise<T[]>;
        listStored(): T[];
        getStored(id: any): T;
        getManyStored(ids: any[]): T[];
        importOne(data: any): T;
        importMany(data: any[]): T[];
        protected _processListResponse(response: TSCore.App.Http.IApiEndpointResponse): T[];
        protected _processGetResponse(response: TSCore.App.Http.IApiEndpointResponse): T;
        protected _processRelations(itemModel: T, itemData: any): void;
    }
}
declare module TSCore.App.Http {
    interface IApiRequest {
        method?: string;
        url?: string;
        headers?: {};
        data?: {};
        urlParams?: {};
    }
    var Method: {
        GET: string;
        POST: string;
        PUT: string;
        DELETE: string;
    };
    class Api {
        protected $http: ng.IHttpService;
        protocol: string;
        hostname: string;
        defaultHeaders: any;
        constructor($http: ng.IHttpService);
        setProtocol(protocol: string): void;
        setHostname(hostname: string): void;
        setDefaultHeader(name: any, value: any): void;
        unsetDefaultHeader(name: any): void;
        request(options: IApiRequest, userOptions: IApiRequest): ng.IHttpPromise<any>;
        private _parseOptions(options);
        private _buildUrl(relativeUrl);
        private _interpolateUrl(url, params);
        private _popFirstKey(source, key);
        private _popKey(object, key);
    }
}
declare module TSCore.App.Http {
    interface IApiEndpointResponse {
        response: ng.IHttpPromiseCallbackArg<{}>;
        fullData: {};
        data: any;
    }
    class ApiEndpoint {
        protected apiService: TSCore.App.Http.Api;
        static $inject: string[];
        path: string;
        singleProperty: string;
        multipleProperty: string;
        protected extractSingleCallback: any;
        protected extractMultipleCallback: any;
        constructor(apiService: TSCore.App.Http.Api);
        request(method: string, path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        getRequest(path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        postRequest(path: string, urlParams: {}, data: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        putRequest(path: string, urlParams: {}, data: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        deleteRequest(path: string, urlParams: {}, options?: IApiRequest, extraOptions?: IApiRequest): ng.IPromise<ng.IHttpPromiseCallbackArg<{}>>;
        list(userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        get(id: number, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        save(id: number, data: {}, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        create(data: {}, userOptions?: any, requestOptions?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        delete(id: number, userOptions?: any, options?: IApiRequest): ng.IPromise<IApiEndpointResponse>;
        extractMultiple(response: ng.IHttpPromiseCallbackArg<{}>): IApiEndpointResponse;
        extractSingle(response: ng.IHttpPromiseCallbackArg<{}>): IApiEndpointResponse;
        transformResponse(item: any): any;
    }
}
declare module TSCore.App.Interceptors {
    module HttpInterceptorEvents {
        const REQUEST: string;
        const REQUEST_ERROR: string;
        const RESPONSE: string;
        const RESPONSE_ERROR: string;
        const RESPONSE_500_ERRORS: string;
        const RESPONSE_401_ERROR: string;
        interface IErrorParams {
            rejection: any;
        }
        interface IRequestParams {
            config: any;
        }
        interface IResponseParams {
            response: any;
        }
        interface IRequestErrorParams extends IErrorParams {
        }
        interface IResponseErrorParams extends IErrorParams {
        }
        interface IResponse500ErrorsParams extends IErrorParams {
        }
        interface IResponseError401 extends IErrorParams {
        }
    }
    class HttpInterceptor {
        protected $q: any;
        static $inject: string[];
        events: TSCore.Events.EventEmitter;
        constructor($q: any);
        request: (config: any) => any;
        requestError: (rejection: any) => any;
        response: (response: any) => any;
        responseError: (rejection: any) => any;
    }
}
declare module TSCore.App.Interceptors {
    module StateAccessLevels {
        const PUBLIC: string;
        const UNAUTHORIZED: string;
        const AUTHORIZED: string;
    }
    module StateInterceptorEvents {
        const FIRST_ROUTE: string;
        const STATE_CHANGE_START: string;
        const ENTERING_AUTHORIZED_AREA: string;
        const ENTERING_UNAUTHORIZED_AREA: string;
        const ENTERING_PUBLIC_AREA: string;
        interface IStateChangeEventParams {
            event: any;
            toState: any;
            toParams: any;
            fromState: any;
            fromParams: any;
        }
    }
    class StateInterceptor {
        protected $rootScope: ng.IRootScopeService;
        static $inject: string[];
        events: TSCore.Events.EventEmitter;
        private _firstRoute;
        private _lastRoute;
        constructor($rootScope: ng.IRootScopeService);
        init(): void;
        private _attachRouterEvents();
        private _$stateChangeStart(event, toState, toParams, fromState, fromParams);
        getFirstRoute(): any;
    }
}
declare module TSCore.App.System {
    class Bootstrap {
        protected _module: ng.IModule;
        protected createModule(): ng.IModule;
        protected getValues(): {} | any[];
        protected getConfigs(): any[];
        protected getServices(): {} | any[];
        protected getFactories(): {} | any[];
        protected getControllers(): {} | any[];
        protected getDirectives(): {} | any[];
        protected getRuns(): any[];
        protected $runInject: string[];
        protected run(...args: any[]): void;
        start(moduleName: string): ng.IModule;
        protected _parseArgs(args: any): any[];
        getModule(): ng.IModule;
    }
}
