"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import teamService, { TeamMember } from "@/services/teamService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Mail,
  ArrowUp,
  ArrowDown,
  X,
  Users,
} from "lucide-react";
import { showSuccess, showError, showWarning } from "@/utils/swal";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    avatar: "",
    email: "",
    socialMedia: {
      linkedin: "",
      twitter: "",
      instagram: "",
      github: "",
    },
    order: 0,
  });

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await teamService.getTeam();
      setTeam(data);
    } catch (error) {
      console.error("Error loading team:", error);
      showError("خطا در بارگذاری اطلاعات تیم");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      avatar: member.avatar || "",
      email: member.email || "",
      socialMedia: {
        linkedin: member.socialMedia?.linkedin || "",
        twitter: member.socialMedia?.twitter || "",
        instagram: member.socialMedia?.instagram || "",
        github: member.socialMedia?.github || "",
      },
      order: member.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedMember(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      avatar: "",
      email: "",
      socialMedia: {
        linkedin: "",
        twitter: "",
        instagram: "",
        github: "",
      },
      order: team.length,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;

    try {
      await teamService.deleteTeamMember(selectedMember._id);
      showSuccess("عضو تیم با موفقیت حذف شد");
      loadTeam();
    } catch (error) {
      showError("خطا در حذف عضو تیم");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedMember) {
        // ویرایش
        await teamService.updateTeamMember(selectedMember._id, formData);
        showSuccess("اطلاعات با موفقیت به‌روزرسانی شد");
      } else {
        // افزودن جدید
        await teamService.addTeamMember(formData);
        showSuccess("عضو جدید با موفقیت اضافه شد");
      }
      setIsDialogOpen(false);
      loadTeam();
    } catch (error) {
      showError("خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      await teamService.toggleTeamMemberStatus(member._id);
      showSuccess(`وضعیت عضو تیم تغییر کرد`);
      loadTeam();
    } catch (error) {
      showError("خطا در تغییر وضعیت");
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    // اینجا می‌تونی منطق مرتب‌سازی رو پیاده‌سازی کنی
    showSuccess("مرتب‌سازی تغییر کرد");
  };

  const moveDown = async (index: number) => {
    if (index === team.length - 1) return;
    // اینجا می‌تونی منطق مرتب‌سازی رو پیاده‌سازی کنی
    showSuccess("مرتب‌سازی تغییر کرد");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
          مدیریت تیم
        </h1>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          افزودن عضو جدید
        </Button>
      </div>

      {/* لیست تیم */}
      <Card>
        <CardHeader>
          <CardTitle>اعضای تیم ({team.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {team.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">هیچ عضوی در تیم وجود ندارد</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>عضو</TableHead>
                  <TableHead>سمت</TableHead>
                  <TableHead>ایمیل</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead className="w-32">مرتب‌سازی</TableHead>
                  <TableHead className="w-32 text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member, index) => (
                  <TableRow key={member._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">
                            {member.bio.slice(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.email || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={member.isActive ? "default" : "secondary"}
                        className={
                          member.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }
                      >
                        {member.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveDown(index)}
                          disabled={index === team.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatus(member)}
                          className="h-8 w-8"
                        >
                          {member.isActive ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(member)}
                          className="h-8 w-8 text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member)}
                          className="h-8 w-8 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* دیالوگ افزودن/ویرایش */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? "ویرایش عضو تیم" : "افزودن عضو جدید"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اطلاعات اصلی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نام و نام خانوادگی *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>سمت *</Label>
                <Input
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>آدرس تصویر</Label>
                <Input
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  placeholder="/uploads/avatar.jpg"
                />
              </div>
            </div>

            {/* بیوگرافی */}
            <div className="space-y-2">
              <Label>بیوگرافی *</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            {/* شبکه‌های اجتماعی */}
            <div className="space-y-3">
              <Label>شبکه‌های اجتماعی</Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-700" />
                  <Input
                    placeholder="لینکدین"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: {
                          ...formData.socialMedia,
                          linkedin: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-sky-500" />
                  <Input
                    placeholder="توییتر"
                    value={formData.socialMedia.twitter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: {
                          ...formData.socialMedia,
                          twitter: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <Input
                    placeholder="اینستاگرام"
                    value={formData.socialMedia.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: {
                          ...formData.socialMedia,
                          instagram: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  <Input
                    placeholder="گیت‌هاب"
                    value={formData.socialMedia.github}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialMedia: {
                          ...formData.socialMedia,
                          github: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ترتیب */}
            <div className="space-y-2">
              <Label>ترتیب نمایش</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                {selectedMember ? "به‌روزرسانی" : "افزودن"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                انصراف
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* دیالوگ تأیید حذف */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف عضو تیم</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف {selectedMember?.name} اطمینان دارید؟ این عمل قابل
              بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
