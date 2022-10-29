import React, {useState,useContext, useRef} from 'react';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import avatar from '../assets/img/avatar.png';
import instance from '../config/axios';
import { AuthContext } from '../context/authContext.js';
import moment from 'moment';
import CommentP from './CommentP.js';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';


const Comment = ({data}) => {
    const {comments,post, totalP, page} = data;
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const {currentUser} = useContext(AuthContext)
    const myref = useRef(null)



    const handleChange = e => {
    setValue(e.target.value)
    };

    const navigate = useNavigate();
    const postComment = async () => {
        if(currentUser){
            setLoading(true)
            try {
                const res = await instance.post(`posts/comment/${post._id}`,{
                authur:currentUser.username,
                body:value
            })
            setValue("")
            navigate(`/${post.cat}/${post.slug}/?page=${Number(res.data.lastPage)}`)
            
        }catch(err) {
             console.log(err)
        }
        setLoading(false)


        }
    }
    const executeScroll = () => myref.current.scrollIntoView()
    const deleteComment = async (id) => {
        
        if(currentUser){
            const res = await instance.delete(`posts/deleteC/${post._id}/${id}`)
            toast.error(res.data)
            navigate(`/${post.cat}/${post.slug}/`)
        }
    }
    return (
        <div>
               <div ref={myref} className='c-section'>
        {comments?.map(comment => (
  <div className='comment' key={comment._id}>
<div className='c-header'>
  <div className='profile'> 
  {currentUser?.profilepic?
               <img src={`${currentUser?.profilepic}`} alt="account" />
               :
               <img src={avatar} alt="account" /> 
  }
    <div className='info'>
        <span>{comment.authur}</span>    
        
     </div>
    
  </div>

  {currentUser?.username === post?.authur && (
               <div className='edit'>
               <span className='editIcon'><Link to={'/create'} state={post}><CreateIcon/></Link></span>
               <span className='deleteIcon'><Link onClick={() => deleteComment(comment._id)}><DeleteIcon/></Link></span>
               </div>)}
 </div>
  <p className='c-content'>
  {comment.body}
   </p>
  <Divider>
    <Chip label={`${ `${moment(comment?.date).fromNow()}`}`} />
  </Divider>
  </div>
    ))}        
<br/>
<br/>
<CommentP data={{totalP,page,post}}/>
<br/>

           <div className='publish-c'>
             <TextField
          id="outlined-multiline-flexible"
          label="Comment"
          multiline
          sx={{ m: 1, width: '35ch' }}
          value={value}
          onChange={handleChange}
        />
        {loading? 
                  <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
                :
        <button onClick={postComment}> Comment </button>
}
             </div>
            
            
             </div> 
        </div>
    );
};

export default Comment;