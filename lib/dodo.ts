import DodoPayments from "dodopayments";

let _dodo: DodoPayments | null = null;

export function getDodo() {
  if (!_dodo) {
    _dodo = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
      environment: process.env.DODO_PAYMENTS_ENVIRONMENT as
        | "test_mode"
        | "live_mode",
    });
  }
  return _dodo;
}
