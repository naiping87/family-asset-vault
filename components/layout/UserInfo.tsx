interface UserInfoProps {
  name: string;
  email: string;
  initial: string;
}

export function UserInfo({ name, email, initial }: UserInfoProps) {
  return (
    <div className="user-info">
      <div className="user-avatar">{initial}</div>
      <div>
        <div className="user-name">{name}</div>
        <div className="user-email">{email}</div>
      </div>
    </div>
  );
}
