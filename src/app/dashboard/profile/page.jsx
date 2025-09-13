"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firestoreData, setFirestoreData] = useState(null);
  const [editData, setEditData] = useState({
    displayName: "",
    email: "",
    password: "",
    role: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Track auth + load Firestore doc
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      setUser(firebaseUser);

      // 🔹 fetch user document
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // create doc if missing
        await setDoc(ref, {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "",
          role: "user",                 // default role
          createdAt: serverTimestamp(),
        });
        setFirestoreData({ role: "user" });
        setEditData({
          displayName: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          password: "",
          role: "user",
        });
      } else {
        const data = snap.data();
        setFirestoreData(data);
        setEditData({
          displayName: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          password: "",
          role: data.role || "user",
        });
      }
    });
    return () => unsub();
  }, [router]);

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");

    try {
      if (editData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: editData.displayName });
      }
      if (editData.email !== user.email) {
        await updateEmail(user, editData.email);
      }
      if (editData.password) {
        await updatePassword(user, editData.password);
      }

      // 🔹 update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName: editData.displayName,
        email: editData.email,
        role: editData.role,
        updatedAt: serverTimestamp(),
      });

      setFirestoreData({ ...firestoreData, role: editData.role });
      setDialogOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (!user) return null;

  const role = firestoreData?.role || "user"; // fallback

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        User Profile
        {/* 🔹 Role badge */}
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            role === "admin"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {role}
        </span>
      </h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {user.displayName || "Not set"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
        </CardContent>

        <CardFooter className="flex gap-3">
          {/* Edit Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your name, email, password or role.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="flex flex-col">
                  <Label>Name</Label>
                  <Input name="displayName"
                    value={editData.displayName}
                    onChange={handleChange}/>
                </div>
                <div className="flex flex-col">
                  <Label>Email</Label>
                  <Input name="email" type="email"
                    value={editData.email}
                    onChange={handleChange}/>
                </div>
                <div className="flex flex-col">
                  <Label>New Password</Label>
                  <Input name="password" type="password"
                    placeholder="Leave blank to keep current password"
                    value={editData.password}
                    onChange={handleChange}/>
                </div>
                <div className="flex flex-col">
                  <Label>Role</Label>
                  <Input name="role"
                    value={editData.role}
                    onChange={handleChange}/>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline"
                        onClick={() => setDialogOpen(false)}
                        disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
