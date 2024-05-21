using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class MeuTrainingContext : DbContext
{
    public MeuTrainingContext()
    {
    }

    public MeuTrainingContext(DbContextOptions<MeuTrainingContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=MeuTraining");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__product__3213E83F90E83296");

            entity.ToTable("product");

            entity.HasIndex(e => e.Code, "UQ__product__357D4CF98F498875").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Brand)
                .HasMaxLength(28)
                .IsUnicode(false)
                .HasColumnName("brand");
            entity.Property(e => e.Category)
                .HasMaxLength(28)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.Code)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("code");
            entity.Property(e => e.Description)
                .HasMaxLength(180)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(90)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Type)
                .HasMaxLength(21)
                .IsUnicode(false)
                .HasColumnName("type");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
