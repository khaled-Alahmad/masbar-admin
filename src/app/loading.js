import { Spinner } from '@nextui-org/react'
import React from 'react'

function loading() {
    return (
        <div className={"loading"}>
            <Spinner size="lg" label="Loading data..." color="primary" />
        </div>
    )
}

export default loading