using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using backend.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Helpers
{
    public class SearchHelper
    {
        private string GenerateCondition(string column)
        {
            char[] punctuationMarks = { ' ', '-', ':', ',', '.', '?', '!' };
            string processedColumn = $"{column}.ToString().ToLower()"; 
            string condition = $"{processedColumn}.Equals(@0)";

            foreach (char punctuationMark in punctuationMarks)
            {
                condition += $" || {processedColumn}.StartsWith(@0 + \"{punctuationMark}\")";
                condition += $" || {processedColumn}.EndsWith(\"{punctuationMark}\" + @0)";
                condition += $" || {processedColumn}.Contains(\" \" + @0 + \"{punctuationMark}\")";
            }
            return condition;
        }

        public IQueryable<Product> ApplyProductSearchFilter(IQueryable<Product> query, string search, string searchColumn)
        {
            List<string> validColumns = new List<string> { "Id", "Code", "Name", "Category", "Brand", "Type", "Description" };
            string formattedSearch = search.ToLower();

            if (string.IsNullOrEmpty(searchColumn) || searchColumn.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                List<string> conditions = new List<string>();

                foreach (string column in validColumns)
                {
                    conditions.Add(GenerateCondition(column));
                }

                string finalCondition = string.Join(" || ", conditions);
                return query.Where(finalCondition, formattedSearch);
            }
            else if (validColumns.Contains(searchColumn, StringComparer.OrdinalIgnoreCase))
            {
                return query.Where(GenerateCondition(searchColumn), formattedSearch);
            }
            else
            {
                throw new ArgumentException("Invalid search column");
            }
        }
    }
}