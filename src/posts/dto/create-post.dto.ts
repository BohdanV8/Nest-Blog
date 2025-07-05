export class CreatePostDto {
    title: string
    content?: string
    authorId: number
    photo: string
    categories?: number[];
}
