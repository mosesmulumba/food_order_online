import { VandorPayLoad } from "./Vandor.dto";
import {CusomerPayload} from "./Customer.dto";

export type AuthPayload = VandorPayLoad  | CusomerPayload;