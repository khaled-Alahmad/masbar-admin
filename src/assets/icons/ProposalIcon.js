import React from 'react'

function ProposalIcon({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 8H18V20C18 21.1046 18.8954 22 20 22C21.1046 22 22 21.1046 22 20V10C22 8.89543 21.1046 8 20 8Z" fill="#28303F" />
            <path opacity="0.4" d="M15 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H20C18.8954 22 18 21.1046 18 20V5C18 3.34315 16.6569 2 15 2Z" fill="#28303F" />
            <path fillRule="evenodd" clipRule="evenodd" d="M5.25 7C5.25 6.58579 5.58579 6.25 6 6.25H14C14.4142 6.25 14.75 6.58579 14.75 7C14.75 7.41421 14.4142 7.75 14 7.75H6C5.58579 7.75 5.25 7.41421 5.25 7Z" fill="#28303F" />
            <path fillRule="evenodd" clipRule="evenodd" d="M5.25 12C5.25 11.5858 5.58579 11.25 6 11.25L14 11.25C14.4142 11.25 14.75 11.5858 14.75 12C14.75 12.4142 14.4142 12.75 14 12.75L6 12.75C5.58579 12.75 5.25 12.4142 5.25 12Z" fill="#28303F" />
            <path fillRule="evenodd" clipRule="evenodd" d="M5.25 17C5.25 16.5858 5.58579 16.25 6 16.25H10C10.4142 16.25 10.75 16.5858 10.75 17C10.75 17.4142 10.4142 17.75 10 17.75H6C5.58579 17.75 5.25 17.4142 5.25 17Z" fill="#28303F" />
        </svg>
    )
}

export default ProposalIcon