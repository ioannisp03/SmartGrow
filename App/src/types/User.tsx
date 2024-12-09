import { DeviceInterface } from "./Device";

export interface UserInterface {
    id: number;
    username: string;
    email: string;
    devices: Array<DeviceInterface>;
}