export class CreatePostDto {
    title: string
    content?: string
    authorId: number
    categories: number[];
}
