import React, { ReactElement } from 'react'

interface Props {
    data: string
}

export default function Result({ data }: Props): ReactElement {
    return (
        <div>
            {data}
        </div>
    )
}
