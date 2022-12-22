import {
  AllowedNetworks,
  Networks,
  WalletService,
} from "services/WalletService";

export function isLocalhostUrl(): boolean {
  const is = window.location.host === "localhost:8080";
  return is;
}

/**
 * @param network Default: Network the current wallet is connected to
 */
export function isLocalhostNetwork(
  network: AllowedNetworks = WalletService.targetedNetwork
): boolean {
  const is = network === Networks.Localhost && isLocalhostUrl();
  return is;
}
