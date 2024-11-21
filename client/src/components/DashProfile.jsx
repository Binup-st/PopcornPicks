import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserFailure, setUpdateUserFailure] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setUpdateUserFailure(null);
    setUpdateUserSuccess(null);
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserFailure("No changes made");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserFailure(data.message);
      }
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User updated Successfully");
    } catch (err) {
      dispatch(updateFailure(err));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

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
        <span className="cursor-pointer" onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" mt-5>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserFailure && (
        <Alert color="failure" mt-2>
          {updateUserFailure}
        </Alert>
      )}
      {error && (
        <Alert color="failure" mt-2>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm Sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
