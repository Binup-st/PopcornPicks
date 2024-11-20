import { Alert, Button, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice";
import { updateUser } from "../../../api/controllers/user.controller";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({})
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserFailure, setUpdateUserFailure] = useState(null)

  const dispatch = useDispatch();

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e)=>{
    setUpdateUserFailure(null)
    setUpdateUserSuccess(null)
    e.preventDefault()
    if(Object.keys(formData).length === 0){
      setUpdateUserFailure("No changes made")
      return
    }
    try{
      dispatch(updateStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data =await res.json()

      if(!res.ok){
        dispatch(updateFailure(data.message))
        setUpdateUserFailure(data.message)
      }
      dispatch(updateSuccess(data))
      setUpdateUserSuccess("User updated Successfully")
    }
    catch(err){
      dispatch(updateFailure(err))
    }
  }

 
  return (
    <div className="max-w-lg mx-auto w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          defaultValue="********"
          onChange={handleChange}
        />
        <Button type="submit" className="bg-customRed" color="red">
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && <Alert color="success" mt-5>{updateUserSuccess}</Alert>}
      {updateUserFailure && <Alert color="failure" mt-2>{updateUserFailure}</Alert>}
    </div>
  );
}
