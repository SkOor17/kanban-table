export interface CardInt {
    id: number
    title: string
    nbCol: number
}

export interface ColInt {
    id: number
    title: string
    color: "red"|"green"|"blue"
    cards: Array<CardInt>
}