import {
  LayoutDashboard, Building2, Shield, Settings,
  Castle, Home, Plus, Edit, Trash2, Upload,
  Sun, Moon, Menu, X, ChevronRight, MapPin,
  DollarSign, FileText, User, LogOut,
  CheckCircle, Clock, Calendar, Receipt, File,
  Search, Bell, UploadCloud, Download, Eye,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Icons: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Properties: Building2,
  Insurance: Shield,
  Settings,
  Castle,
  Home,
  Plus,
  Edit,
  Trash2,
  Upload,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  MapPin,
  DollarSign,
  FileText,
  User,
  LogOut,
  CheckCircle,
  Clock,
  Calendar,
  Receipt,
  File,
  Search,
  Bell,
  UploadCloud,
  Download,
  Eye,
};

export function Icon({ name, size = 20, className, ...props }: {
  name: string;
  size?: number;
  className?: string;
  [key: string]: unknown;
}) {
  const Comp = Icons[name] || File;
  return <Comp size={size} className={className} {...props} />;
}
