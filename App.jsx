
// React app PWA-enabled for showroom QR order system
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ScanLine } from "lucide-react";

export default function ShowroomApp() {
  const [customer, setCustomer] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const mockProducts = {
    "B0Q038053566": {
      name: "BERMUDA TASCA FATIGUE",
      price: 84,
      colors: ["400 ORANGE JUICE", "534 RUBINO"],
      sizes: ["44", "46", "48", "50", "52", "54", "56"]
    },
    "BJQ018053562": {
      name: "BERMUDA JOGGING",
      price: 67,
      colors: ["100 BIANCO", "700 CAFFÈ"],
      sizes: ["44", "46", "48", "50", "52"]
    }
  };

  const handleScan = () => {
    if (mockProducts[scannedCode]) {
      setProduct({ ...mockProducts[scannedCode], code: scannedCode });
    } else {
      alert("Product not found");
    }
  };

  const addToCart = (size, color, qty) => {
    setCart([...cart, {
      customer,
      code: product.code,
      name: product.name,
      size,
      color,
      qty,
      price: product.price
    }]);
    setProduct(null);
    setScannedCode("");
  };

  const downloadExcel = () => {
    const headers = ["Code", "Name", "Size", "Color", "Quantity", "Price"];
    const rows = cart.map(p => [p.code, p.name, p.size, p.color, p.qty, p.price]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${customer}_order.csv`;
    link.click();
  };

  return (
    <div className="p-4 space-y-4">
      <Input placeholder="Enter your name" value={customer} onChange={e => setCustomer(e.target.value)} />

      <div className="flex gap-2">
        <Input placeholder="Scan or enter code" value={scannedCode} onChange={e => setScannedCode(e.target.value)} />
        <Button onClick={handleScan}><ScanLine className="w-4 h-4 mr-1" /> Scan</Button>
      </div>

      {product && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div><strong>{product.name}</strong> — €{product.price}</div>
            <div className="flex gap-2">
              <select id="size">
                {product.sizes.map(s => <option key={s}>{s}</option>)}
              </select>
              <select id="color">
                {product.colors.map(c => <option key={c}>{c}</option>)}
              </select>
              <Input id="qty" type="number" min="1" defaultValue="1" className="w-16" />
              <Button onClick={() => addToCart(
                document.getElementById("size").value,
                document.getElementById("color").value,
                document.getElementById("qty").value
              )}>Add</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {cart.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Cart</h2>
          {cart.map((item, i) => (
            <div key={i} className="border-b py-2">
              {item.name} | {item.size} | {item.color} x {item.qty} — €{item.price}
            </div>
          ))}
          <Button className="mt-4" onClick={downloadExcel}><Download className="w-4 h-4 mr-1" />Download Excel</Button>
        </div>
      )}
    </div>
  );
}
