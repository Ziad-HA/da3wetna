import { Navigate } from "react-router-dom"
import { readOwnerToken } from "../lib/storage"

/** Paymob بيرجّع الزبون هنا بعد الدفع؛ بنوديه للوحة طلبه. */
export function PayResult() {
  const token = readOwnerToken()
  return token ? <Navigate to={`/dashboard/${token}?paid=1`} replace /> : <Navigate to="/account" replace />
}
