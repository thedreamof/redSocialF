export interface IPublication {
    _id: string;
    title: string;
    description: string;
    avatar: string;
    likes: IUser[];
    comments: IComment[];
    userCreated: IUser;
    createAt: Date | string;
}

export interface IUser {
    idUser?: string;
    username?: string;
    avatar?: string;
    like?: boolean;
}

export interface IComment {
    description: string;
    users: IUser;
    likes: IUser[];
    createAt: Date | string;
}