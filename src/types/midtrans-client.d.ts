declare module "midtrans-client" {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  export class Snap {
    constructor(options: SnapOptions);
    createTransaction(
      parameter: Record<string, unknown>,
    ): Promise<SnapTransactionResult>;
  }

  export class CoreApi {
    constructor(options: SnapOptions);
  }

  const Midtrans: {
    Snap: typeof Snap;
    CoreApi: typeof CoreApi;
  };
  export default Midtrans;
}
