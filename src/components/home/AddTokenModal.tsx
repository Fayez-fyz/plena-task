import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addTokens } from "@/redux/slice/watchList.slice";
import type { Coin } from "@/types/coins";
import { Check, Loader2, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";

export function AddTokenDialog() {
  const dispatch = useAppDispatch();
  const existingTokenIds = useAppSelector((state) =>
    state.watchlist.tokens.map((token) => token.id)
  );
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [trendingTokens, setTrendingTokens] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchTrendingTokens();
  }, [open]);

  const fetchTrendingTokens = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${
          import.meta.env.VITE_COIN_GECKO_API
        }`
      );
      const data = await res.json();
      if (data && data.coins) setTrendingTokens(data.coins);
    } catch (error) {
      console.error("Error fetching trending tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = trendingTokens.filter(
    (token) =>
      !existingTokenIds.includes(token.item.id) &&
      (token.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.item.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTokenToggle = (tokenId: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(tokenId)) {
      newSelected.delete(tokenId);
    } else {
      newSelected.add(tokenId);
    }
    setSelectedTokens(newSelected);
  };

  const handleAddToWatchlist = () => {
    const tokensToAdd = trendingTokens.filter((token) =>
      selectedTokens.has(token.item.id)
    );
    dispatch(addTokens(tokensToAdd));

    setSelectedTokens(new Set());
    setSearchQuery("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-primary cursor-pointer font-medium flex items-center justify-center rounded-[6px] text-xs !gap-1 !sm:gap-3 sm:text-sm text-primary-foreground px-1 sm:px-4 py-3 sm:py-5 primary-button-shadow min-w-[90px] sm:min-w-auto"
        >
          <Plus className="size-5 text-primary-foreground" />
          Add Token
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-background rounded-[12px] overflow-hidden border-border p-0 m-0">
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search tokens (e.g., ETH, SOL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" h-[52px] bg-foreground border-none rounded-none text-secondary placeholder:text-muted placeholder:text-sm font-medium  focus-visible:ring-0 focus-visible:border-0"
            />
          </div>

          <div className="text-muted-foreground text-sm font-medium px-4">
            Trending
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-hidden space-y-2 px-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Loader2 className="mx-auto animate-spin h-20 w-20" />
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery
                  ? "No tokens found"
                  : "All available tokens are already in your watchlist"}
              </div>
            ) : (
              filteredTokens.map((token) => {
                const isSelected = selectedTokens.has(token.item.id);
                return (
                  <div
                    key={token.item.id}
                    onClick={() => handleTokenToggle(token.item.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors  hover:bg-[#A9E8510F]",
                      isSelected && "bg-[#A9E8510F]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={token.item.thumb}
                        alt={token.item.name}
                        className="w-8 h-8 rounded-xl"
                      />
                      <div>
                        <div className="font-normal text-sm text-secondary">
                          {token.item.name} ({token.item.symbol})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isSelected ? (
                        <div className="flex items-center gap-4">
                          <div className=" size-4 md:size-5  flex items-center gap-3 justify-center">
                            <Star className="size-4 md:size-5 text-primary fill-primary" />
                          </div>

                          <div className="size-4 md:size-5 rounded-full bg-primary flex items-center gap-3 justify-center">
                            <Check className="size-3 md:size-4 text-primary-foreground" />
                          </div>
                        </div>
                      ) : (
                        <div className=" size-4 md:size-5 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="bg-foreground p-3 sm:p-4 flex justify-end items-center border-t border-border">
            <Button
              onClick={handleAddToWatchlist}
              disabled={selectedTokens.size === 0}
              className=" bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 not-disabled:primary-button-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:border disabled:shadow-none disabled:text-[#52525B]"
            >
              Add to Wishlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
