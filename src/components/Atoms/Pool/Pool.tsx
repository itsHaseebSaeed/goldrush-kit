import { actionableWrapper } from "@/utils/functions";
import { type PoolProps } from "@/utils/types/atoms.types";
import { TokenAvatar } from "..";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

export const Pool: React.FC<PoolProps> = ({
    token_0_ticker_symbol,
    token_1_ticker_symbol,
    pool_address,
    token_0_logo_url,
    token_1_logo_url,
    actionable_pool = () => null,
}) => {
    return (
        <div className="flex items-center gap-2">
            <TokenAvatar
                size={GRK_SIZES.EXTRA_SMALL}
                token_url={token_0_logo_url}
            />
            <div className="-ml-6">
                <TokenAvatar
                    size={GRK_SIZES.EXTRA_SMALL}
                    token_url={token_1_logo_url}
                />
            </div>

            {actionableWrapper(
                actionable_pool(pool_address),
                `${token_0_ticker_symbol}-${token_1_ticker_symbol}`
            )}
        </div>
    );
};
