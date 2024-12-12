import { DeviceInterface } from "./Device";

export interface UserInterface {
    _id: string;
    username: string;
    email: string;
    devices: DeviceInterface[];
}