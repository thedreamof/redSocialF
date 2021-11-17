export interface IPublication {
    _id: string;
    title: string;
    description: string;
    image: string;
    likes: IUser[];
    comments: Comment[];
    userCreated: IUser;
    createAt: Date | string;
}

export interface IUser {
    idUser?: string;
    username?: string;
    avatar?: string;
    like?: boolean;
}