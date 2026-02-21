import api from "./api";

export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  avatar?: string;
  email?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
  order: number;
  isActive: boolean;
  createdAt: string;
}

class TeamService {
  // دریافت لیست تیم
  async getTeam(activeOnly?: boolean): Promise<TeamMember[]> {
    const params = activeOnly ? { active: true } : {};
    const response = await api.get("/team", { params });
    return response.data;
  }

  // دریافت یک عضو تیم با ID
  async getTeamMemberById(id: string): Promise<TeamMember> {
    const response = await api.get(`/team/${id}`);
    return response.data;
  }

  // اضافه کردن عضو جدید (فقط ادمین)
  async addTeamMember(data: {
    name: string;
    position: string;
    bio: string;
    avatar?: string;
    email?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      github?: string;
    };
    order?: number;
  }): Promise<TeamMember> {
    const response = await api.post("/team", data);
    return response.data;
  }

  // ویرایش عضو (فقط ادمین)
  async updateTeamMember(
    id: string,
    data: Partial<{
      name: string;
      position: string;
      bio: string;
      avatar: string;
      email: string;
      socialMedia: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        github?: string;
      };
      order: number;
      isActive: boolean;
    }>,
  ): Promise<TeamMember> {
    const response = await api.put(`/team/${id}`, data);
    return response.data;
  }

  // حذف عضو (فقط ادمین)
  async deleteTeamMember(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  }

  // تغییر وضعیت فعال/غیرفعال (فقط ادمین)
  async toggleTeamMemberStatus(
    id: string,
  ): Promise<{ message: string; isActive: boolean }> {
    const response = await api.patch(`/team/${id}/toggle`);
    return response.data;
  }
}

export default new TeamService();
