using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TEST100API.Migrations.AppDb
{
    /// <inheritdoc />
    public partial class Test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShippingTransferSteps");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "ShippingInfos",
                newName: "ShLastName");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "ShippingInfos",
                newName: "ShFirstName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ShLastName",
                table: "ShippingInfos",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "ShFirstName",
                table: "ShippingInfos",
                newName: "FirstName");

            migrationBuilder.CreateTable(
                name: "ShippingTransferSteps",
                columns: table => new
                {
                    ShippingTransferStepID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShippingTransferID = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TransferStatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
                name: "IX_ShippingTransferSteps_ShippingTransferID",
                table: "ShippingTransferSteps",
                column: "ShippingTransferID");
        }
    }
}
