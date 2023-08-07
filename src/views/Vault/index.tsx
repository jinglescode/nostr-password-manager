import List from "./List";
import { useUserVaults } from "../../hooks/useUserVaults";
import { accountStore } from "../../stores/account";

export default function VaultView() {
  const user = accountStore((state) => state.user);

  const { data } = useUserVaults(user?.pk);
  console.log(333, "vault data", data);

  return (
    <>
      <List />
    </>
  );
}
