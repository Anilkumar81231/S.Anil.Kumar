import type { Project, Education, Skill, PersonalInfo, ApiResponse } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Generic API fetch function
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Projects API
export const projectsApi = {
  getAll: async (params?: { featured?: boolean; limit?: number }): Promise<ApiResponse<Project[]>> => {
    const searchParams = new URLSearchParams()
    if (params?.featured) searchParams.append("featured", "true")
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const query = searchParams.toString()
    return apiRequest<Project[]>(`/projects${query ? `?${query}` : ""}`)
  },

  create: async (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Project>> => {
    return apiRequest<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    })
  },
}

// Education API
export const educationApi = {
  getAll: async (type?: "degree" | "certification" | "course"): Promise<ApiResponse<Education[]>> => {
    const query = type ? `?type=${type}` : ""
    return apiRequest<Education[]>(`/education${query}`)
  },

  create: async (education: Omit<Education, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Education>> => {
    return apiRequest<Education>("/education", {
      method: "POST",
      body: JSON.stringify(education),
    })
  },
}

// Skills API
export const skillsApi = {
  getAll: async (category?: "frontend" | "backend" | "database" | "tools" | "other"): Promise<ApiResponse<Skill[]>> => {
    const query = category ? `?category=${category}` : ""
    return apiRequest<Skill[]>(`/skills${query}`)
  },
}

// Profile API
export const profileApi = {
  get: async (): Promise<ApiResponse<PersonalInfo>> => {
    return apiRequest<PersonalInfo>("/profile")
  },

  update: async (profile: Partial<PersonalInfo>): Promise<ApiResponse<PersonalInfo>> => {
    return apiRequest<PersonalInfo>("/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    })
  },
}



// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:4000/api/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(FormData),
//     });

//     const data = await res.json();
//     if (data.success) {
//       alert("Message sent successfully!");
      
//       setFormData({ name: "", email: "", subject: "", message: "" });
//     } else {
//       alert(data.message || "Failed to send message");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error sending message");
//   }
// };
// export { handleSubmit };  













const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // ✅ Use env variable or fallback directly to your Formspree URL
    const ENDPOINT =
      process.env.NEXT_PUBLIC_FORM_ENDPOINT || "https://formspree.io/f/xwprgzkk";

    // 📨 Send the form data to Formspree
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      alert("✅ Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      alert(data.message || "❌ Failed to send message. Try again later.");
    }
  } catch (err) {
    console.error("Send error:", err);
    alert("⚠️ Network error — please try again.");
  }
};

export { handleSubmit };
