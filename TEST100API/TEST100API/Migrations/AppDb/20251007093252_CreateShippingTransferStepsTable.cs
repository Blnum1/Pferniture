using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TEST100API.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class CreateShippingTransferStepsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Shipping_Method",
                table: "ShippingInfos",
                newName: "LastName");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "ShippingInfos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShippingTransferID",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ShippingTransfers",
                columns: table => new
                {
                    ShippingTransferID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderID = table.Column<int>(type: "int", nullable: false),
                    TransferMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShippingCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TransferDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrackingNumber = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingTransfers", x => x.ShippingTransferID);
                    table.ForeignKey(
                        name: "FK_ShippingTransfers_Orders_OrderID",
                        column: x => x.OrderID,
                        principalTable: "Orders",
                        principalColumn: "OrderID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ShippingTransferSteps",
                columns: table => new
                {
                    ShippingTransferStepID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShippingTransferID = table.Column<int>(type: "int", nullable: false),
                    TransferStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingTransferSteps", x => x.ShippingTransferStepID);
                    table.ForeignKey(
                        name: "FK_ShippingTransferSteps_ShippingTransfers_ShippingTransferID",
                        column: x => x.ShippingTransferID,
                        principalTable: "ShippingTransfers",
                        principalColumn: "ShippingTransferID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShippingTransfers_OrderID",
                table: "ShippingTransfers",
                column: "OrderID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShippingTransferSteps_ShippingTransferID",
                table: "ShippingTransferSteps",
                column: "ShippingTransferID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShippingTransferSteps");

            migrationBuilder.DropTable(
                name: "ShippingTransfers");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "ShippingInfos");

            migrationBuilder.DropColumn(
                name: "ShippingTransferID",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "ShippingInfos",
                newName: "Shipping_Method");
        }
    }
}
