export type User = any;
export declare class UsersService {
    private users;
    private saltOrRounds;
    constructor();
    init(): Promise<void>;
    findOne(username: string, pass: string): Promise<User | undefined>;
    modifyUser(modifyUserDto: any): Promise<{}>;
}
