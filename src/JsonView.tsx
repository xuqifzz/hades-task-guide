import React from 'react'
import ReactJson from 'react-json-view'
export default function JsonView(prop: { target: unknown }) {
    const { target } = prop;
    return (
        <pre className='json-container'>
            <ReactJson
                src={target as object}
                name={false}
                displayObjectSize={false}
                displayDataTypes={false}
                enableClipboard={false}
                theme="monokai"
                shouldCollapse={(f) => true}

            />
        </pre>
    )
}
