import { Button } from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


export default function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick =async ()=>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({prompt: 'select_account'})
        try{
            dispatch(signInStart)
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultsFromGoogle)
            const res = await fetch("/api/auth/google",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                })
            })
            const data = await res.json()
            if(res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
        }
        catch(err){
            dispatch(signInFailure(err.message))
        }
    }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 pr-2'/> Continue With Google
    </Button>
  )
}
