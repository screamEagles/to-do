// import React, { useEffect, useState, useCallback } from "react";
// import "./Todo.css";
// import TodoCards from "./ToDoCards";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Update from "./Update";
// import axios from "axios";

// let id = sessionStorage.getItem("id");
// let toUpdateArray = [];

// const Todo = () => {
//   const [Inputs, setInputs] = useState({
//     title: "",
//     body: "",
//   });
//   const [Array, setArray] = useState([]);

//   const show = () => {
//     document.getElementById("textarea").style.display = "block";
//   };

//   const change = (e) => {
//     const { name, value } = e.target;
//     setInputs({ ...Inputs, [name]: value });
//   };

//   const submit = useCallback(async () => {
//     if (Inputs.title === "" || Inputs.body === "") {
//       toast.error("Title Or Body Can't Be Empty");
//     } else {
//       if (id) {
//         await axios
//           .post(`http://localhost:1000/api/v2/addTask`, {
//             title: Inputs.title,
//             body: Inputs.body,
//             id: id,
//           })
//           .then((response) => {
//             console.log(response);
//           });
//         setInputs({ title: "", body: "" });
//         toast.success("Your Task is added. Refresh to see changes");
//       } else {
//         setArray([...Array, Inputs]);
//         setInputs({ title: "", body: "" });
//         toast.success("Your Task is added. Refresh to see changes");
//         toast.error("Your Task Is Not Saved ! Please SignUp");
//       }
//     }
//   }, [Inputs, Array]);

//   const del = async (Cardid) => {
//     if (id) {
//       await axios
//         .delete(`http://localhost:1000/api/v2/deleteTask/${Cardid}`, {
//           data: { id: id },
//         })
//         .then(() => {
//           toast.success("Your task is deleted. Refresh to see changes.");
//         });
//     } else {
//       toast.error("Please SignUp First");
//     }
//   };

//   const dis = (value) => {
//     document.getElementById("todo-update").style.display = value;
//   };

//   const update = (value) => {
//     console.log("Selected task:", Array[value]._id);
//     const taskToUpdate = Array[value]._id;
//     if (taskToUpdate) {
//       toUpdateArray = {
//         ...taskToUpdate,
//         _id: taskToUpdate, // Extract the actual ObjectId
//       };
//     } else {
//       toast.error("Invalid task selected for update");
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       const fetch = async () => {
//         await axios
//           .get(`http://localhost:1000/api/v2/getTasks/${id}`)
//           .then((response) => {
//             setArray(response.data.list);
//           });
//       };
//       fetch();
//     }
//   }, []);

//   return (
//     <>
//       <div className="todo">
//         <ToastContainer />
//         <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
//           <div className="d-flex flex-column todo-inputs-div w-lg-50 w-100 p-1">
//             <input
//               type="text"
//               placeholder="TITLE"
//               className="my-2 p-2 todo-inputs"
//               onClick={show}
//               name="title"
//               value={Inputs.title}
//               onChange={change}
//             />
//             <textarea
//               id="textarea"
//               type="text"
//               placeholder="BODY"
//               name="body"
//               className=" p-2 todo-inputs"
//               value={Inputs.body}
//               onChange={change}
//             />
//           </div>
//           <div className=" w-50 w-100 d-flex justify-content-end my-3">
//             <button className="home-btn px-2 py-1" onClick={() => {  submit(); }}>
//               Add
//             </button>
//           </div>
//         </div>
//         <div className="todo-body">
//           <div className="container-fluid">
//             <div className="row ">
//               {Array &&
//                 Array.map((item, index) => (
//                   <div
//                     className="col-lg-3 col-11 mx-lg-5 mx-3 my-2"
//                     key={index}
//                   >
//                     <TodoCards
//                       title={item.title}
//                       body={item.body}
//                       id={item._id}
//                       delid={del}
//                       display={dis}
//                       updateId={index}
//                       toBeUpdate={update}
//                     />
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="todo-update " id="todo-update">
//         <div className="container update">
//           <Update display={dis} update={toUpdateArray} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Todo;
import React, { useEffect, useState, useCallback } from "react";
import "./Todo.css";
import TodoCards from "./ToDoCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

let id = sessionStorage.getItem("id");

const Todo = () => {
  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
  });
  const [Array, setArray] = useState([]);
  const [isTextareaVisible, setTextareaVisible] = useState(false); // State to control textarea visibility
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const showTextarea = () => {
    setTextareaVisible(true); // Set the textarea to visible when clicked
  };

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = useCallback(async () => {
    if (Inputs.title === "" || Inputs.body === "") {
      toast.error("Title Or Body Can't Be Empty");
    } else {
      if (id) {
        if (isUpdating) {
          // Handle the update logic
          await axios
            .put(`http://localhost:1000/api/v2/updateTask/${currentTaskId}`, Inputs)
            .then((response) => {
              toast.success(response.data.message);
              setIsUpdating(false);
              setCurrentTaskId(null);
            });
        } else {
          // Handle the create task logic
          await axios
            .post(`http://localhost:1000/api/v2/addTask`, {
              title: Inputs.title,
              body: Inputs.body,
              id: id,
            })
            .then((response) => {
              console.log(response);
            });
        }
        setInputs({ title: "", body: "" });
        toast.success("Your Task is added. Refresh to see changes");
      } else {
        setArray([...Array, Inputs]);
        setInputs({ title: "", body: "" });
        toast.success("Your Task is added. Refresh to see changes");
        toast.error("Your Task Is Not Saved! Please Sign Up");
      }
    }
  }, [Inputs, Array, isUpdating, currentTaskId]);

  const del = async (Cardid) => {
    if (id) {
      await axios
        .delete(`http://localhost:1000/api/v2/deleteTask/${Cardid}`, {
          data: { id: id },
        })
        .then(() => {
          toast.success("Your task is deleted. Refresh to see changes.");
        });
    } else {
      toast.error("Please Sign Up First");
    }
  };

  const update = (index) => {
    const taskToUpdate = Array[index];
    if (taskToUpdate) {
      setInputs({
        title: taskToUpdate.title,
        body: taskToUpdate.body,
      });
      setCurrentTaskId(taskToUpdate._id);
      setIsUpdating(true);
      setTextareaVisible(true); // Ensure textarea is visible when updating
    } else {
      toast.error("Invalid task selected for update");
    }
  };

  useEffect(() => {
    if (id) {
      const fetch = async () => {
        await axios
          .get(`http://localhost:1000/api/v2/getTasks/${id}`)
          .then((response) => {
            setArray(response.data.list);
          });
      };
      fetch();
    }
  }, []);

  return (
    <>
      <div className="todo">
        <ToastContainer />
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-lg-50 w-100 p-1">
            <input
              type="text"
              placeholder="TITLE"
              className="my-2 p-2 todo-inputs"
              onClick={showTextarea}
              name="title"
              value={Inputs.title}
              onChange={change}
            />
            {isTextareaVisible && (
              <textarea
                type="text"
                placeholder="BODY"
                name="body"
                className="p-2 todo-inputs"
                value={Inputs.body}
                onChange={change}
              />
            )}
          </div>
          <div className="w-50 w-100 d-flex justify-content-end my-3">
            <button className="home-btn px-2 py-1" onClick={submit}>
              {isUpdating ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row">
              {Array &&
                Array.map((item, index) => (
                  <div
                    className="col-lg-3 col-11 mx-lg-5 mx-3 my-2"
                    key={index}
                  >
                    <TodoCards
                      title={item.title}
                      body={item.body}
                      id={item._id}
                      delid={del}
                      updateId={index}
                      toBeUpdate={update}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
