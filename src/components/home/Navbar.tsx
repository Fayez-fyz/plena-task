import { Link } from "react-router";
import BrandLogo from "@/assets/BrandLogo.svg";
import { Button } from "../ui/button";
import WalletIcon from "@/assets/icons/WalletIcon.svg";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <nav className="w-full p-1 sm:p-2 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-1 sm:gap-2">
        <img
          src={BrandLogo}
          alt="Brand Logo"
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        />
        <span className="font-semibold text-base sm:text-xl text-secondary truncate max-w-[120px] sm:max-w-none">
          Token Portfolio
        </span>
      </Link>

      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      variant={"default"}
                      className="bg-primary cursor-pointer font-medium flex items-center justify-center rounded-full text-xs gap-2 sm:gap-3 sm:text-[13px] text-primary-foreground px-2 sm:px-3 py-3 sm:py-5 primary-button-shadow min-w-[90px] sm:min-w-auto"
                      onClick={openConnectModal}
                    >
                      <img
                        src={WalletIcon}
                        alt="Wallet Icon"
                        className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                      />
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      variant={"default"}
                      className="bg-red-500 hover:bg-red-600 cursor-pointer font-medium flex items-center justify-center rounded-full text-xs gap-2 sm:gap-3 sm:text-[13px] text-primary-foreground px-2 sm:px-3 py-3 sm:py-5 min-w-[90px] sm:min-w-auto"
                      onClick={openChainModal}
                    >
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <Button
                    variant={"default"}
                    className="bg-primary cursor-pointer font-medium flex items-center justify-center rounded-full text-xs gap-2 sm:gap-3 sm:text-[13px] text-primary-foreground px-2 sm:px-3 py-3 sm:py-5 primary-button-shadow min-w-[90px] sm:min-w-auto"
                    onClick={openAccountModal}
                  >
                    <img
                      src={WalletIcon}
                      alt="Wallet Icon"
                      className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                    />
                    {account.displayName}
                  </Button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </nav>
  );
};

export default Navbar;