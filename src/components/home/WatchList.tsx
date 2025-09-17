import DeleteIcon from "@/assets/icons/DeleteIcon.svg";
import EditIcon from "@/assets/icons/EditIcon.svg";
import RefreshIcon from "@/assets/icons/RefreshIcon.svg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeToken,
  updateHoldings,
  updatePrices,
  type WatchlistToken,
} from "@/redux/slice/watchList.slice";
import { MoreHorizontal, Star } from "lucide-react";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AddTokenDialog } from "./AddTokenModal";

const WatchList = () => {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector((state) => state.watchlist.tokens);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tokens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tokens.slice(startIndex, endIndex);
  const displayStart = startIndex + 1;
  const displayEnd = Math.min(endIndex, tokens.length);

  const handleEditHoldings = (token: WatchlistToken) => {
    setEditingId(token.id);
    setEditValue(token.holdings.toString());
  };

  const handleSaveHoldings = (e: React.FormEvent, tokenId: string) => {
    e.preventDefault();
    const newHoldings = Number.parseFloat(editValue);
    if (!isNaN(newHoldings) && newHoldings >= 0) {
      dispatch(updateHoldings({ id: tokenId, holdings: newHoldings }));
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleRemove = (tokenId: string) => {
    dispatch(removeToken(tokenId));
    const newTotalPages = Math.ceil((tokens.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleRefreshPrices = async () => {
    if (tokens.length === 0) return;

    setRefreshing(true);
    try {
      const coinIds = tokens.map((token) => token.id).join(",");

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_sparkline_7d=true&x_cg_demo_api_key=${
          import.meta.env.VITE_COIN_GECKO_API
        }`
      );

      const data = await response.json();
      const priceUpdates = tokens.map((token) => ({
        id: token.id,
        price: data[token.id]?.usd || token.price || 0,
        change24h:
          data[token.id]?.usd_24h_change ||
          token.price_change_percentage_24h_usd ||
          0,
        sparkline: token.sparkline, 
      }));

      dispatch(updatePrices(priceUpdates));
    } catch (error) {
      console.error("Error refreshing prices:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (tokens.length === 0) {
    return (
      <section className="m-2 md:m-4 mt-8 md:mt-10">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 items-center">
            <Star className="size-7 text-primary fill-primary" />
            <h2 className="text-secondary font-medium text-lg sm:text-2xl">Watchlist</h2>
          </div>
          <div className="flex gap-3 items-center">
            <AddTokenDialog />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Star className="size-16 text-muted mb-4" />
          <h3 className="text-lg font-medium text-secondary mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-muted text-sm mb-6">
            Add some tokens to track their performance
          </p>
          <AddTokenDialog />
        </div>
      </section>
    );
  }

  return (
    <section className="m-2 md:m-4 mt-8 md:mt-10 ">
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2 items-center">
          <Star className="size-7 text-primary fill-primary" />
          <h2 className="text-secondary font-medium text-xl sm:text-2xl">Watchlist</h2>
        </div>
        <div className="flex gap-3 items-center">
          <Button
            variant={"default"}
            onClick={handleRefreshPrices}
            disabled={refreshing}
            className="bg-foreground cursor-pointer font-medium flex items-center justify-center rounded-[6px] text-xs gap-2 sm:gap-3 sm:text-sm text-secondary px-3 sm:px-4 py-3 sm:py-5   sm:min-w-auto hover:bg-primary-foreground/20 secondary-button-shadow"
          >
            <img
              src={RefreshIcon || "/placeholder.svg"}
              alt="Refresh Icon"
              className={`w-4 h-4 sm:w-5 sm:h-5 object-contain ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:block">
              {refreshing ? "Refreshing..." : "Refresh Prices"}
            </span>
          </Button>
          <AddTokenDialog />
        </div>
      </div>
      <div>
        <div className="rounded-lg border border-border bg-transparent mt-4">
          <Table>
            <TableHeader>
              <TableRow className=" h-11 bg-foreground hover:bg-foreground">
                <TableHead className=" px-6 text-muted font-medium text-[13px] sm:text-xs">
                  Token
                </TableHead>
                <TableHead className="text-muted font-medium text-[13px] sm:text-xs">
                  Price
                </TableHead>
                <TableHead className="text-muted font-medium text-[13px] sm:text-xs">
                  24h %
                </TableHead>
                <TableHead className="text-muted font-medium text-[13px] sm:text-xs">
                  Sparkline (7d)
                </TableHead>
                <TableHead className="text-muted font-medium text-[13px] sm:text-xs">
                  Holdings
                </TableHead>
                <TableHead className="text-muted font-medium text-[13px] sm:text-xs">
                  Value
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((token) => (
                <TableRow
                  key={token.id}
                  className="border-none h-12 hover:bg-foreground"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={token.thumb}
                          alt={token.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-normal text-[13px] text-secondary">
                          {token.name}{" "}
                          <span className="text-muted">
                            ({token.symbol.toUpperCase()})
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-normal text-[13px] text-muted">
                      $
                      {(token.price || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className="font-normal text-[13px] text-muted"
                    >
                      {(token.price_change_percentage_24h_usd || 0) >= 0
                        ? "+"
                        : ""}
                      {(token.price_change_percentage_24h_usd || 0).toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    {token.sparkline ? (
                      <img
                        src={token.sparkline}
                        alt="7d sparkline"
                        className="w-20 h-10 object-contain"
                      />
                    ) : (
                      <div className="w-20 h-10 bg-muted/20 rounded flex items-center justify-center">
                        <span className="text-xs text-muted">No data</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    {editingId === token.id ? (
                      <form
                        className="flex items-center gap-2"
                        onSubmit={(e) => handleSaveHoldings(e, token.id)}
                      >
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEditValue(e.target.value)
                          }
                          className="w-32 h-8 text-[13px] bg-transparent border border-primary primary-button-shadow text-secondary focus-visible:border-primary focus-visible:primary-button-shadow"
                          step="0.0001"
                          placeholder="0.0000"
                          min="0"
                        />
                        <Button
                          size="sm"
                          type="submit"
                          className="h-8 px-3 text-[11px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium primary-button-shadow"
                        >
                          Save
                        </Button>
                      </form>
                    ) : (
                      <span className="font-normal text-[13px] text-secondary">
                        {token.holdings.toFixed(4)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="font-normal text-[13px] text-secondary">
                      $
                      {token.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4 text-secondary" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-foreground border-border"
                      >
                        <DropdownMenuItem
                          className="text-muted font-medium text-[13px] border-b focus:bg-background focus:text-muted"
                          onClick={() => handleEditHoldings(token)}
                        >
                          <img
                            src={EditIcon || "/placeholder.svg"}
                            alt="Edit Icon"
                            className="w-4 h-4 object-contain"
                          />
                          Edit Holdings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive font-medium text-[13px] focus:bg-background focus:text-destructive"
                          onClick={() => handleRemove(token.id)}
                        >
                          <img
                            src={DeleteIcon || "/placeholder.svg"}
                            alt="Delete Icon"
                            className="w-4 h-4 object-contain"
                          />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-6 py-3 border-t border-border">
            <div className=" text-[13px] font-medium text-muted">
              {displayStart} — {displayEnd} of {tokens.length} results
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[13px] font-medium text-muted">
                {currentPage} of {totalPages} pages
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-muted font-medium text-[13px] bg-transparent hover:bg-transparent hover:text-secondary disabled:opacity-50 cursor-pointer"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-muted font-medium text-[13px] bg-transparent hover:bg-transparent hover:text-secondary disabled:opacity-50 cursor-pointer"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchList;
