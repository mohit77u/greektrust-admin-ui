import React, { useEffect, useState } from 'react'

export default function Home(){
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [startPoint, setStartPoint] = useState(0);
    const [paginations, setPaginations] = useState([]);
    const [deleteRow, setDeleteRow] = useState({});
    const [searchText, setSearchText] = useState(false);

    var perPage = 10;

    // get paginateMainitain
    const paginateMainitain = (items) => {
        
        setUsers(items);

        let paginations = [];
        let paginationCount = Math.ceil(items.length/perPage);
        paginationCount = paginationCount > 1 ? paginationCount : 1;

        for (let i = 1; i <= paginationCount; i++) {
            paginations.push(i);
        }

        setLastPage(paginationCount);
        setPaginations(paginations);
    }

    // get users
    const getUsers = () => {
        fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json', {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((res) => {
            setAllUsers(res)
            paginateMainitain(res)

        }).catch((err) => {
            console.log(err);
        });

    }

    // handle row
    const handleDeleteRow = (e, index) => {
        let user = users[index]
        let id = user.id
        if(e.target.checked) {
            setDeleteRow({...deleteRow, [id] : true})
        } else {
            setDeleteRow({...deleteRow, [id] : false})
        }
    }

    // handle select all row
    const handleSelectAllRow = (e) => {
        let data = {}

        for (let i = 0; i < users.length; i++) {
            let user = users[i]
            let id = user.id
            if(e.target.checked) {
                data[id] = true;
            } else {
                data[id] = false;
            }
        }   

        setDeleteRow(data)
    }

    // handle selected click
    const deleteSelected = () => {
        alert('Delete Selected');
    }
    
    // handle search
    const handleSearch = (e) => {
        let value = e.target.value
        value = value.toLowerCase();

        const filteredUsers = allUsers.filter((user) => {
            return user?.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value) || user.role.toLowerCase().includes(value);
        })

        paginateMainitain(filteredUsers);
    }

    // handle click
    const handlePaginationClick = (page) => {
        setCurrentPage(page)
        setStartPoint((page - 1) * perPage + 1)

        // check search input is true or not
        if(searchText) {
            paginateMainitain(users);
        } else {
            paginateMainitain(allUsers);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <>
            {/* table */}
            <section className="table-content lg:w-10/12 md:w-11/12 mx-auto py-12">
                {/* search bar */}
                <div className="pb-4 bg-white">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                        </div>
                        <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search here..." onChange={() => setSearchText(true)} onKeyUp={(e) => {handleSearch(e);}} />
                    </div>
                </div>

                {/* table */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-5">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:border-gray-600" onChange={handleSelectAllRow} />
                                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {users?.length > 0 ? <>
                            {users?.slice(startPoint,  startPoint + 9)?.map((user, index) => (
                                <tr className={deleteRow[user?.id] ? "bg-slate-200 border-b hover:bg-gray-50" : "bg-white border-b hover:bg-gray-50"} key={index}>
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input id={'checkbox_' + user?.id} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:border-gray-600" onChange={(e) => {handleDeleteRow(e, index)}} checked={deleteRow[user?.id] ? true : false} />
                                            <label htmlFor={'checkbox_' + user?.id} className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {user?.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user?.email}
                                    </td>
                                    <td className="px-6 py-4 capitalize">
                                        {user?.role}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-5">
                                            <button className="font-medium text-blue-600 hover:underline">
                                                <img src="/images/edit.png" className='w-[30px]' alt="edit" />
                                            </button>
                                            <button className="font-medium text-red-600 hover:underline">
                                                <img src="/images/delete.png" className='w-[30px]' alt="delete" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </> : <>
                            <tr className={"bg-slate-200 border-b hover:bg-gray-50"}>
                                <td colSpan={5} className="px-6 py-4 capitalize text-center">
                                    No users found.
                                </td>
                            </tr>
                        </> }
                        </tbody>
                    </table>
                </div>

                {/* paginations */}
                <div className="flex justify-between mt-10">
                    {/* delete selected */}
                    <button className='bg-rose-500 text-white text-sm rounded-full px-4 py-2' onClick={deleteSelected}>Delete Selected</button>
                    <div className="flex justify-center gap-3 items-center">
                        <button disabled = {currentPage === 1 ? true : false} className={currentPage === 1 ? 'bg-gray-200 text-gray-600 rounded-full w-10 h-10' : 'bg-blue-500 text-white rounded-full w-10 h-10'} onClick={(e) => {handlePaginationClick(1)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button disabled = {currentPage === 1 ? true : false} className={currentPage === 1 ? 'bg-gray-200 text-gray-600 rounded-full w-10 h-10' : 'bg-blue-500 text-white rounded-full w-10 h-10'} onClick={(e) => {handlePaginationClick(currentPage - 1)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        {/* main paginations */}
                        { paginations?.map((number) => (
                            <button disabled = {currentPage === number ? true : false} className={currentPage === number ? 'bg-gray-200 text-gray-600 rounded-full w-10 h-10' : 'bg-blue-500 text-white rounded-full w-10 h-10'} key={number} onClick={(e) => {handlePaginationClick(number)}}>
                                {number}
                            </button>
                        ))}
                        {/* main paginations end */}
                        <button disabled = {currentPage === lastPage ? true : false} className={currentPage === lastPage ? 'bg-gray-200 text-gray-600 rounded-full w-10 h-10' : 'bg-blue-500 text-white rounded-full w-10 h-10'} onClick={(e) => {handlePaginationClick(currentPage + 1)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                        <button disabled = {currentPage === lastPage ? true : false} className={currentPage === lastPage ? 'bg-gray-200 text-gray-600 rounded-full w-10 h-10' : 'bg-blue-500 text-white rounded-full w-10 h-10'} onClick={(e) => {handlePaginationClick(lastPage)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>

            </section>
        </>
    )
}
