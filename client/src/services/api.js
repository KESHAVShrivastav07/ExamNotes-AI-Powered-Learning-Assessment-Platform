import axios from "axios";
import { serverUrl } from "../App";
import { setUserData, setLoading } from "../redux/userSlice";

/* ================================
   Get Current User + Auto Redirect
================================= */
export const getCurrentUser = async (dispatch, navigate) => {
  try {
    const result = await axios.get(
      serverUrl + "/api/user/currentuser",
      { withCredentials: true }
    );

    const data = result.data;

    // ✅ store in redux
    const payload = data?.user ? { ...data.user, role: data.role } : data;
    dispatch(setUserData(payload));

    // ✅ ROLE BASED REDIRECT (only if explicitly requested via navigate)
    if (navigate && data?.role) {
      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "teacher") navigate("/teacher/dashboard");
      else navigate("/");
    }

    return data;

  } catch (error) {
    console.log("Get Current User Error:", error);
    dispatch(setUserData(null)); 
  } finally {
    dispatch(setLoading(false)); 
  }
};

export const login = async (email, password, dispatch) => {
  try {
    const result = await axios.post(
      serverUrl + "/api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    const data = result.data;
    const payload = data?.user ? { ...data.user, role: data.role } : data;
    dispatch(setUserData(payload));
    
    return data;
  } catch (error) {
    console.log("Login Error:", error);
    throw error;
  }
};

/* ================================
   Generate Notes
================================= */
export const generateNotes = async (payload) => {
  try {
    const result = await axios.post(
      serverUrl + "/api/notes/generate-notes",
      payload,
      { withCredentials: true }
    );

    return result.data;

  } catch (error) {
    console.log("Generate Notes Error:", error);
    throw error;
  }
};

/* ================================
   Download PDF
================================= */
export const downloadPdf = async (result) => {
  try {
    const response = await axios.post(
      serverUrl + "/api/pdf/generate-pdf",
      { result },
      {
        responseType: "blob",
        withCredentials: true
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ExamNotesAI.pdf";
    document.body.appendChild(link); // ✅ best practice
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log("PDF Error:", error);
    throw new Error("PDF download failed");
  }
};

export const logout = async () => {
  try {
    await axios.get(serverUrl + "/api/auth/logout", {
      withCredentials: true,
    });
  } catch (error) {
    console.log("Logout error:", error);
    throw error;
  }
};

export const getAdminUsers = async () => {
  const result = await axios.get(serverUrl + "/api/admin/users", {
    withCredentials: true,
  });
  return result.data.users;
};

export const getAdminUserNotes = async (userId) => {
  const result = await axios.get(serverUrl + `/api/admin/users/${userId}/notes`, {
    withCredentials: true,
  });
  return result.data.notes;
};

export const getAdminTeachers = async () => {
  const result = await axios.get(serverUrl + "/api/admin/teachers", {
    withCredentials: true,
  });
  return result.data.teachers;
};

export const getAdminTeacherNotes = async (teacherId) => {
  const result = await axios.get(serverUrl + `/api/admin/teachers/${teacherId}/notes`, {
    withCredentials: true,
  });
  return result.data.notes;
};
